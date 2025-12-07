// sensors/camera.js
const cv = require('opencv4nodejs');

let cap = null;
let previousFrame = null;
let gestureDebounce = null;
let lastGesture = '';
let gestureStartTime = 0;

// 카메라 초기화
async function initCamera() {
    try {
        cap = new cv.VideoCapture(0);
        cap.set(cv.CAP_PROP_FRAME_WIDTH, 320);  // 해상도 낮춰서 성능 향상
        cap.set(cv.CAP_PROP_FRAME_HEIGHT, 240);
        
        // 카메라 워밍업
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('📷 Camera initialized');
    } catch (err) {
        console.error('Camera init error:', err);
    }
}

// 동작 인식 함수
async function detectGesture() {
    if (!cap) {
        return '';
    }

    try {
        const frame = cap.read();
        if (frame.empty) return lastGesture;

        const gray = frame.cvtColor(cv.COLOR_BGR2GRAY);
        const blurred = gray.gaussianBlur(new cv.Size(21, 21), 0);

        // 첫 프레임이면 저장하고 종료
        if (!previousFrame) {
            previousFrame = blurred;
            return '';
        }

        // 프레임 차이 계산
        const frameDelta = previousFrame.absdiff(blurred);
        const thresh = frameDelta.threshold(30, 255, cv.THRESH_BINARY);
        const dilated = thresh.dilate(
            cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(3, 3)),
            new cv.Point(-1, -1),
            2
        );

        // 윤곽선 찾기
        const contours = dilated.findContours(
            cv.RETR_EXTERNAL,
            cv.CHAIN_APPROX_SIMPLE
        );

        // 이전 프레임 업데이트
        previousFrame = blurred;

        if (contours.length === 0) {
            // 움직임이 없으면 이전 제스처 지속 시간 체크
            if (Date.now() - gestureStartTime > 500) {
                lastGesture = '';
            }
            return lastGesture;
        }

        // 가장 큰 움직임 영역들을 찾기
        const largeContours = contours
            .filter(c => c.area > 3000)
            .sort((a, b) => b.area - a.area);

        if (largeContours.length === 0) {
            if (Date.now() - gestureStartTime > 500) {
                lastGesture = '';
            }
            return lastGesture;
        }

        const maxContour = largeContours[0];
        const rect = maxContour.boundingRect();
        const area = maxContour.area;
        
        const frameHeight = frame.rows;
        const frameWidth = frame.cols;
        
        // 움직임 중심점
        const centerY = rect.y + rect.height / 2;
        const centerX = rect.x + rect.width / 2;
        
        let detectedGesture = '';

        // 점프 감지: 화면 하단~중앙에서 큰 수직 움직임
        const isLowerRegion = centerY > frameHeight * 0.4;
        const isLargeVertical = rect.height > frameHeight * 0.3;
        const isLargeMotion = area > 8000;
        
        if (isLowerRegion && isLargeVertical && isLargeMotion) {
            detectedGesture = 'jump';
        }
        
        // 손들기 감지: 화면 상단에서 넓은 움직임 (여러 윤곽선)
        const upperContours = largeContours.filter(c => {
            const r = c.boundingRect();
            const cy = r.y + r.height / 2;
            return cy < frameHeight * 0.5;
        });
        
        const hasUpperMotion = upperContours.length >= 1;
        const isWideMotion = rect.width > frameWidth * 0.3;
        const isUpperHalf = centerY < frameHeight * 0.5;
        
        if (hasUpperMotion && isWideMotion && isUpperHalf && area > 6000) {
            detectedGesture = 'handsUp';
        }

        // 제스처 디바운싱 (같은 제스처가 연속되면 유지)
        if (detectedGesture) {
            if (detectedGesture !== lastGesture) {
                gestureStartTime = Date.now();
                lastGesture = detectedGesture;
            }
            return detectedGesture;
        }

        // 제스처가 없으면 500ms 후 초기화
        if (Date.now() - gestureStartTime > 500) {
            lastGesture = '';
        }

        return lastGesture;

    } catch (err) {
        console.error('Gesture detection error:', err);
        return lastGesture;
    }
}

// 리소스 정리
function cleanup() {
    if (cap) {
        cap.release();
    }
    previousFrame = null;
    lastGesture = '';
}

module.exports = {
    initCamera,
    detectGesture,
    cleanup
};