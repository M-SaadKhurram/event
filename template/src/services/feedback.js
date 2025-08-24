import api from '../utils/api'

export const submitFeedback = async (data) => {
  // Map frontend fields to backend schema
  const payload = {
    fullName: data.name,
    email: data.email,
    eventType: data.eventType,
    satisfaction: Number(data.overallRating),
    easeOfUse: Number(data.easeOfUse),
    customerService: Number(data.customerService),
    features: Number(data.features),
    recommendation: data.recommendation,
    improvement: data.improvements,
    successStory: data.testimonial,
    allowPublicUse: data.allowPublic,
  }
  return api.post('/feedback', payload)
}

export const getFeedbacks = async () => {
  return api.get('/feedback')
}