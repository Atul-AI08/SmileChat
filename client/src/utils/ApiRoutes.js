export const HOST = "http://localhost:3005";

const authRoute = `${HOST}/api/auth`;
const MESSAGES_ROUTE = `${HOST}/api/messages`;

export const onBoardUserRoute = `${authRoute}/onboarduser`;
export const CHECK_USER_ROUTE = `${authRoute}/check-user`;
export const GET_ALL_CONTACTS = `${authRoute}/get-contacts`;
export const updateLastSeen = `${authRoute}/update-last-seen`;
export const updateProfile = `${authRoute}/update-profile`;
export const CREATE_GROUP = `${authRoute}/create-group`;
export const ADD_GROUP_MEMBER = `${authRoute}/add-group-member`;
export const LEAVE_GROUP = `${authRoute}/leave-group`;

export const ADD_MESSAGE_ROUTE = `${MESSAGES_ROUTE}/add-message`;
export const GET_MESSAGES_ROUTE = `${MESSAGES_ROUTE}/get-messages`;
export const ADD_AUDIO_MESSAGE_ROUTE = `${MESSAGES_ROUTE}/add-audio-message`;
export const ADD_FILE_MESSAGE_ROUTE = `${MESSAGES_ROUTE}/add-file-message`;
export const GET_INITIAL_CONTACTS_ROUTE = `${MESSAGES_ROUTE}/get-initial-contacts`;
export const DISAPPEARING_TIME = `${MESSAGES_ROUTE}/set-disappearing-time`;
