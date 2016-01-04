if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('js/service-worker.js').then(function(registration) {
	// Registration was successful
	console.log('ServiceWorker registration successful with scope: ',    registration.scope);
	registration.pushManager.subscribe().then(function(subscription){
	isPushEnabled = true;
	console.log("subscription.subscriptionId: ", subscription.subscriptionId);
	console.log("subscription.endpoint: ", subscription.endpoint);

	});
  }).catch(function(err) {
    // registration failed :(
    console.log('ServiceWorker registration failed: ', err);
  });
}
