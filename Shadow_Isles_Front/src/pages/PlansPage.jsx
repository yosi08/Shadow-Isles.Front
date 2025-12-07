import { useState } from 'react'
import { usePlans } from '../hooks/usePlans'
import './PlansPage.css'

function PlansPage() {
  const { plans, isLoading, error, createPlan, updatePlan, deletePlan } = usePlans()
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    const result = await createPlan(formData)

    if (result.success) {
      setIsCreating(false)
      setFormData({ title: '', description: '', startDate: '', endDate: '' })
    }
  }

  const handleUpdate = async (e, planId) => {
    e.preventDefault()
    const result = await updatePlan(planId, formData)

    if (result.success) {
      setEditingId(null)
      setFormData({ title: '', description: '', startDate: '', endDate: '' })
    }
  }

  const handleDelete = async (planId) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      await deletePlan(planId)
    }
  }

  const startEdit = (plan) => {
    setEditingId(plan.id)
    setFormData({
      title: plan.title,
      description: plan.description,
      startDate: plan.startDate,
      endDate: plan.endDate,
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setIsCreating(false)
    setFormData({ title: '', description: '', startDate: '', endDate: '' })
  }

  if (isLoading) {
    return (
      <div className="plans-page">
        <div className="loading">Loading plans...</div>
      </div>
    )
  }

  return (
    <div className="plans-page">
      <div className="plans-container">
        <div className="plans-header">
          <h1>My Plans</h1>
          {!isCreating && (
            <button onClick={() => setIsCreating(true)} className="create-plan-btn">
              + New Plan
            </button>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        {isCreating && (
          <div className="plan-form-card">
            <h2>Create New Plan</h2>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Plan title"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Plan description"
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="save-btn">
                  Create
                </button>
                <button type="button" onClick={cancelEdit} className="cancel-btn">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="plans-list">
          {plans.length === 0 ? (
            <div className="no-plans">No plans yet. Create your first plan!</div>
          ) : (
            plans.map((plan) => (
              <div key={plan.id} className="plan-card">
                {editingId === plan.id ? (
                  <form onSubmit={(e) => handleUpdate(e, plan.id)}>
                    <div className="form-group">
                      <label>Title</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="3"
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Start Date</label>
                        <input
                          type="date"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-group">
                        <label>End Date</label>
                        <input
                          type="date"
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="form-actions">
                      <button type="submit" className="save-btn">
                        Save
                      </button>
                      <button type="button" onClick={cancelEdit} className="cancel-btn">
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="plan-content">
                      <h3>{plan.title}</h3>
                      <p>{plan.description}</p>
                      <div className="plan-dates">
                        {plan.startDate && <span>Start: {plan.startDate}</span>}
                        {plan.endDate && <span>End: {plan.endDate}</span>}
                      </div>
                    </div>
                    <div className="plan-actions">
                      <button onClick={() => startEdit(plan)} className="edit-btn">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(plan.id)} className="delete-btn">
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default PlansPage
