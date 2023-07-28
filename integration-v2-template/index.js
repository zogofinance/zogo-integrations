// the id of the module you want to link to
const MODULE_ID = '<MODULE_ID>';

// user token for the individual instance of the iFrame, single use. See documentation for details on how you should be retrieving this token.
const TOKEN = '<ZOGO_TOKEN>';

// the base url integration.zogo.com is the current active production environment dev-integration.zogo.com is the latest published version
const BASE_URL = 'https://integration.zogo.com'; // || https://dev-integration.zogo.com

// the basic settings and auth token
const BASE_URL_PARAMS = `?widget_type=deep_link&token=${TOKEN}&module_id=${MODULE_ID}`;

//customizable items object
const INTEGRATION_CUSTOMIZATIONS = {
  colors: {
    primary: '#0050AA', // any valid hex color; Default: #0050AA
    header: '#484848', // any valid hex color; Default: #484848
    sub_header: '#6F6F6F', // any valid hex color; Default: #6F6F6F
    button: '#FFFFFF', // any valid hex color; Default: #FFFFFF
    background: '#FFFFFF', // any valid hex color; Default: #FFFFFF
    highlight: '#DCDCDC', // any valid hex color; Default: #DCDCDC
  },
  font: 'gotham', // gotham || raleway || notosans || merriweather
  button: {
    text_style: 'capitalize', // capitalize || uppercase || lowercase
    border_radius: 8, // reccommeded range 0 - 30; < 30 has no effect
  },
  language: 'en-US', // en-US || es-US
  end_of_module: {
    cta_text: 'You finished this module!', // Default: 'You finished this module!'
    cta_button_text: 'done', // Default: 'done'
    cta_post_message: 'module complete', // this is emitted to the parent app (this app/ your implementation) so you can control navigating see FLOW LISTENERS below
    banner_image: null, // image url for optional banner image
    banner_post_message: 'banner clicked', // this is emitted when a user taps the banner image.
  },
};

// the customizations get url encoded and prepped to be added as a URL parameter
const encodedIntegrationCustomizations = encodeURIComponent(
  JSON.stringify(INTEGRATION_CUSTOMIZATIONS)
);

// the final URL to be used on the iFrame and the customizations
const builtiFrameURL =
  BASE_URL +
  BASE_URL_PARAMS +
  `&integration_customizations=${encodedIntegrationCustomizations}`;

// FLOW LISTENERS
// these listeners listen to feedback / communication from the zogo app to the parent app (this site in this example)
window.addEventListener('message', event => {
  if (event.origin !== BASE_URL) {
    return;
  }
  console.log('message heard: ', event.data);

  /* when ready to display content Zogo sends a postmessage
     with the message "zogo ready" as the text to let the parent app
     know that it is ready and whatever loader the parent uses is
     no longer needed.
  */
  if (event.data === 'zogo ready') {
    console.log('hide loader');
    const loader = document.getElementById('loader');
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
  if (event.data.startsWith('openURL:')) {
    const urlClicked = event.data.split(':')[1];
    console.log(`user clicked on link: ${urlClicked}`);
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
