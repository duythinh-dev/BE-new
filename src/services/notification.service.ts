import { publisher, subscriber } from "../pubsub.js";

export const CHANNELS = {
  NEW_POST: "notifications:new_post",
  POST_UPDATED: "notifications:post_updated",
  POST_DELETED: "notifications:post_deleted",
};

// Publish event
export const publishEvent = async (channel: string, data: object) => {
  await publisher.publish(channel, JSON.stringify(data));
  console.log(`Published to ${channel}:`, data);
};

// Subscribe và xử lý event
export const startSubscriber = () => {
  subscriber.subscribe(
    CHANNELS.NEW_POST,
    CHANNELS.POST_UPDATED,
    CHANNELS.POST_DELETED,
    (err, count) => {
      if (err) console.error("Subscribe error:", err);
      else console.log(`Subscribed to ${count} channels`);
    },
  );

  subscriber.on("message", (channel, message) => {
    const data = JSON.parse(message);

    switch (channel) {
      case CHANNELS.NEW_POST:
        console.log(
          `🔔 New post created by user ${data.userId}: "${data.title}"`,
        );
        // Thực tế: gửi email, push notification, websocket...
        break;

      case CHANNELS.POST_UPDATED:
        console.log(`📝 Post ${data.postId} updated by user ${data.userId}`);
        break;

      case CHANNELS.POST_DELETED:
        console.log(`🗑️ Post ${data.postId} deleted by user ${data.userId}`);
        break;
    }
  });
};

export { subscriber };
