module.exports = function (app, bunyanLogger) {
  const pgdbHandler = require('./pg.controller')
  // const db = require('../queries')

  // PostgreSQL Handlers
  app.get('/api/activity', pgdbHandler.getActivity);
  app.post('/api/activity', pgdbHandler.createActivity); 
  app.put('/api/activity', pgdbHandler.updateActivity);
  app.delete('/api/activity', pgdbHandler.deleteActivity);
  // app.delete('/api/activities', pgdbHandler.deleteActivities);

  app.get('/api/engagement', pgdbHandler.getEngagement);
  app.post('/api/engagement', pgdbHandler.createEngagement);
  app.put('/api/engagement', pgdbHandler.updateEngagement);
  app.delete('/api/engagement', pgdbHandler.deleteEngagement);

  // app.post('/api/bulk-upload', pgdbHandler.bulkUpload);
  // app.get('/api/filter_groups', pgdbHandler.getFilterGroups)
  // app.post('/api/search_analytics', pgdbHandler.searchAnalytics)
 
 
 
  // DB2 Handlers
  // app.get('/api/activity', db2dbHandler.getActivity);
  // app.post('/api/activity', db2dbHandler.createActivity);
  // app.put('/api/activity', db2dbHandler.updateActivity);
  // app.delete('/api/activity', db2dbHandler.deleteActivity);
  // app.delete('/api/activities', db2dbHandler.deleteActivities);

  // app.get('/api/engagement', db2dbHandler.getEngagement);
  // app.post('/api/engagement', db2dbHandler.createEngagement);
  // app.put('/api/engagement', db2dbHandler.updateEngagement);
  // app.delete('/api/engagement', db2dbHandler.deleteEngagement);

  // app.post('/api/bulk-upload', db2dbHandler.bulkUpload);

  // app.get('/api/filter_groups', db2dbHandler.getFilterGroups)
  // app.post('/api/search_analytics', db2dbHandler.searchAnalytics)

  //// STATIC RESOURCES
  // app.use(express.static(path.join(__dirname, './../public/')));
  // app.use(express.static(path.join(__dirname, './../dist/')));
}
