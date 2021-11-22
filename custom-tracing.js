// Always initialize the collector as the first module inside the application.
const instana = require('@instana/collector')({
  tracing: {
    disableAutomaticTracing: true
  },
  serviceName: 'CustomTracingService',
  agentHost: 'localhost'
});

// instantiate the OpenTracing tracer:
const opentracing = require('opentracing');

setTimeout(() => {

  // optionally use the opentracing provided singleton tracer wrapper
  opentracing.initGlobalTracer(instana.opentracing.createTracer());

  // retrieve the tracer instance from the opentracing tracer wrapper
  const tracer = opentracing.globalTracer();

  // start a new trace with an operation name
  const span = tracer.startSpan('auth');

  // mark operation as failed
  span.setTag(opentracing.Tags.ERROR, true);

  // Print span
  var mySpan = instana.currentSpan();
  console.log("The current span, if any, is - ", mySpan.getName())
  
  // finish the span and schedule it for transmission to instana
  span.finish();

}, 5000);