const EventResponse = require('../EventResponse');

class MergeRequestApproved extends EventResponse {
  constructor(...args) {
    super(...args, {
      description: 'This event gets fired when a merge request is approved',
    });
  }

  embed(data) {
    const mergeRequest = data.object_attributes;
    return {
      color: 0x149617,
      title: `Approved merge request #${mergeRequest.iid}: \`${mergeRequest.title}\``,
    };
  }

  text(data) {
    const actor = data.user.name;
    const issue = data.object_attributes;
    return [
      `✔️  **${actor}** approved merge request **#${issue.iid}** _${issue.title}_`,
      `<${issue.url}>`,
    ].join('\n');
  }
}

module.exports = MergeRequestApproved;
