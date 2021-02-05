import request from "@/utils/request";

export function addMessage(query) {
  return request({
    url: "/admin/add_message",
    method: "post",
    data: query
  });
}

export function getMessage(query) {
  return request({
    url: "/admin/message_management",
    method: "post",
    data: query
  });
}
export function getUnreadMessage() {
  return request({
    url: "/admin/unread_message",
    method: "post"
  });
}

export function readMessage(id) {
  return request({
    url: "/admin/read",
    method: "post",
    data: { id }
  });
}
