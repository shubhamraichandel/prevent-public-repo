const { App, Octokit } = require("octokit");
const EventSource = require("eventsource");

require("dotenv").config();

// keys
const keys = {
  appId: process.env.APP_ID,
  privateKey: process.env.PRIVATE_KEY,
  secret: process.env.WEBHOOK_SECRET,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  installationId: process.env.INSTALLATION_ID,
};

// App Settings
const app = new App({
  appId: keys.appId,
  privateKey: keys.privateKey,
  webhooks: {
    secret: keys.secret,
  },
  oauth: {
    clientId: keys.clientId,
    clientSecret: keys.clientSecret
  },
});

const octokit = new Octokit({
  auth: process.env.GITHUB_PAT, //replace with ServiceUser's PAT
});

const webhookProxyURL = process.env.WEBHOOK_PROXY;
const source = new EventSource(webhookProxyURL);

// Verify and receive headers
source.onmessage = (event) => {
  const webhookEvent = JSON.parse(event.data);
  app.webhooks
    .verifyAndReceive({
      id: webhookEvent["x-request-id"],
      name: webhookEvent["x-github-event"],
      signature: webhookEvent["x-hub-signature"],
      payload: webhookEvent.body,
    })
    .catch(console.error);
};

// createIssue() triggers whenever a public repo is created or any exsiting repo is publicized.
function createIssue({ payload }, title, body) {
  return octokit.rest.issues.create({
    owner: payload.repository.owner.login,
    repo: payload.repository.name,
    title: title,
    body: body,
  });
}
// updateRepo() to change a repo's visibility
function updateRepo({ payload }) {
  return octokit.rest.repos.update({
    owner: payload.repository.owner.login,
    repo: payload.repository.name,
    private: true,
    visibility: "private", //defaults to private
  });
}

// webhook event listener - on repository created
app.webhooks.on("repository.created", ({ payload }) => {
  const title = "Public repository was created";
  const body = "This repo was publicized. I have already turned it to private";
  if (payload.repository.visibility == "public") {
    updateRepo({ payload })
      .then(createIssue({ payload }, title, body))
      .then(
        console.log(
          `warning.. ${payload.repository.name} was created with public visibility, turning to private`
        )
      )
      .catch((err) => console.log(err));
  }
});

// webhook event listener - on repository publicized
app.webhooks.on("repository.publicized", ({ payload }) => {
  const title = "Repository was publicized";
  const body = "This repo was publicized. I have already turned it to private";
  updateRepo({ payload })
    .then(createIssue({ payload }, title, body))
    .then(
      console.log(
        `warning.. ${payload.repository.name} was publicized, turning to private`
      )
    )
    .catch((err) => console.log(err));
});

module.exports = app;