// the id of the module you want to link to
const module_id = 255;

// user token for the individual instance of the iFrame, single use. See documentation for details on how you should be retrieving this token.
const token = '<ZOGO_TOKEN>';

// the base url integration.zogo.com is the current active production environment dev-integration.zogo.com is the latest published version
const baseURL = 'https://integration.zogo.com'; // || https://dev-integration.zogo.com

// the basic settings and auth token
const BASEURLPARAMS = `?widget_type=deep_link&token=${token}`;

//customizable items object
const integrationCustomizations = {
  colors: {
    primary: '#0050AA', // or any valid hex color
    header: '#484848', // or any valid hex color
    sub_header: '6F6F6F', // or any valid hex color
    button: '#FFFFFF', // or any valid hex color
    background: '#FFFFFF', // or any valid hex color
    highlight: '#DCDCDC', // or any valid hex color
  },
  font: 'gotham', // raleway || notosans || merriweather
  button: {
    text_style: 'capitalize', // uppercase || lowercase
    border_radius: 8, // reccommeded range 0 - 30; < 30 has no effect
  },
  language: 'en_US', // es_US
  end_of_module: {
    cta_text: 'You finished this module!',
    cta_button_text: 'done',
    cta_post_message: 'module complete', // this is emitted to the parent app (this app/ your implementation) so you can control navigating see FLOW LISTENERS below
    banner_image: 'https://i.imgur.com/NiaFQjY.png', // an dedicated image or ad space will emit the below post message when clicked
    banner_post_message: 'banner clicked', // this is emitted when a user taps the banner image.
  },
};

// the customizations get url encoded and prepped to be added as a URL parameter
const encodedIntegrationCustomizations = encodeURIComponent(
  JSON.stringify(integrationCustomizations)
);

// the final URL to be used on the iFrame and the customizations
const builtiFrameURL =
  baseURL +
  BASEURLPARAMS +
  `&integration_customizations=${encodedIntegrationCustomizations}`;

// FLOW LISTENERS
// these listeners listen to feedback / communication from the zogo app to the parent app (this site in this example)
window.addEventListener('message', event => {
  console.log('message heard: ', event.data);

  /* when ready to display content Zogo sends a post request
     with the message zogo ready as the text to let the parent app
     know that it is ready and whatever loader the parent uses is 
     no longer needed.
  */
  if (event.data === 'zogo ready') {
    console.log('hide loader');
    loader.parentNode.removeChild(loader);
  }

  /* in this example the call_to_action_post_message property is set to module complete 
  
  */
  if (event.data === 'module complete') {
    console.log('module complete');
    returnToParentHome();
  }
  if (event.data === 'banner clicked') {
    console.log('banner image clicked');
  }
  if (event.origin !== this.iFrameURL) {
    return;
  }
});

// holder variables for this demo, not relavent to your implementation
let loader;
let iframe;
let parentApp;
let startLearningButton;
let parentAppHeader;

document.addEventListener('DOMContentLoaded', function (event) {
  // prepping the parent app by removing elements from the DOM
  parentAppHeader = document.getElementById('parent-app-header');
  parentAppHeader.parentNode.removeChild(parentAppHeader);
  console.log('parent app header pulled from the DOM');

  loader = document.getElementById('loader');
  loader.parentNode.removeChild(loader);
  console.log('loader pulled from the DOM');
  //document.getElementById("simulation-container").appendChild(loader);

  iframe = document.getElementById('iframe');
  iframe.parentNode.removeChild(iframe);
  iframe.src = builtiFrameURL;
  console.log('iframe pulled from DOM');
});

function startLearning() {
  // the user clicked to start the learning flow
  // we simulate naigivation to the app add the loader and await the zogo ready message
  // see listener on line 30
  console.log('start learning clicked');

  parentApp = document.getElementById('parent-app');
  parentApp.parentNode.removeChild(parentApp);

  startLearningButton = document.getElementById('start-learning-button');
  startLearningButton.parentNode.removeChild(startLearningButton);

  document.getElementById('simulation-container').appendChild(loader);
  document.getElementById('simulation-container').appendChild(iframe);
  document.getElementById('simulation-container').appendChild(parentAppHeader);
}

function returnToParentHome() {
  parentAppHeader.parentNode.removeChild(parentAppHeader);
  console.log('parent app header pulled from the DOM');
  loader?.parentNode?.removeChild(loader);
  console.log('loader pulled from the DOM');
  iframe.parentNode.removeChild(iframe);
  console.log('iframe pulled from DOM');

  document.getElementById('simulation-container').appendChild(parentApp);
  document
    .getElementById('simulation-container')
    .appendChild(startLearningButton);
}
