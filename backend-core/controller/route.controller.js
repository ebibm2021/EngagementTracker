module.exports = function (app) {
  const pgdbHandler = require('./pg.controller')
  const healthHandler = require('./health.controller')
 
  // PostgreSQL Handlers
  app.get('/api/activity', pgdbHandler.getActivity);
  app.post('/api/activity', pgdbHandler.createActivity); 
  app.put('/api/activity', pgdbHandler.updateActivity);
  app.delete('/api/activity', pgdbHandler.deleteActivity);
  app.delete('/api/activities', pgdbHandler.deleteActivities);

  app.get('/api/engagement', pgdbHandler.getEngagement);
  app.post('/api/engagement', pgdbHandler.createEngagement);
  app.put('/api/engagement', pgdbHandler.updateEngagement);
  app.delete('/api/engagement', pgdbHandler.deleteEngagement);

  app.post('/api/bulk-upload', pgdbHandler.bulkUpload);
  app.get('/api/filter_groups', pgdbHandler.getFilterGroups)
  app.post('/api/search_analytics', pgdbHandler.searchAnalytics)

  app.get('/api/health', healthHandler.getHealth)
}
