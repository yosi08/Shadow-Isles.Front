import { useForecast } from '../hooks/useForecast'
import './ForecastPage.css'

function ForecastPage() {
  const { forecast, isLoading, error, fetchForecast } = useForecast()

  if (isLoading) {
    return (
      <div className="forecast-page">
        <div className="loading">Loading forecast...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="forecast-page">
        <div className="error-container">
          <p>{error}</p>
          <button onClick={fetchForecast} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="forecast-page">
      <div className="forecast-container">
        <h1>Weather Forecast</h1>

        {forecast ? (
          <div className="forecast-content">
            <div className="forecast-header">
              <h2>{forecast.title || 'Today\'s Forecast'}</h2>
              <p className="forecast-date">{forecast.date || new Date().toLocaleDateString()}</p>
            </div>

            <div className="forecast-main">
              <div className="temperature">
                <span className="temp-value">{forecast.temperature || 'N/A'}</span>
                <span className="temp-unit">°C</span>
              </div>
              <p className="weather-description">{forecast.description || 'No description available'}</p>
            </div>

            <div className="forecast-details">
              <div className="detail-item">
                <span className="detail-label">Humidity</span>
                <span className="detail-value">{forecast.humidity || 'N/A'}%</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Wind Speed</span>
                <span className="detail-value">{forecast.windSpeed || 'N/A'} km/h</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Precipitation</span>
                <span className="detail-value">{forecast.precipitation || 'N/A'}%</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">UV Index</span>
                <span className="detail-value">{forecast.uvIndex || 'N/A'}</span>
              </div>
            </div>

            {forecast.recommendations && forecast.recommendations.length > 0 && (
              <div className="recommendations">
                <h3>Recommendations</h3>
                <ul>
                  {forecast.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="no-forecast">No forecast data available</div>
        )}
      </div>
    </div>
  )
}

export default ForecastPage
