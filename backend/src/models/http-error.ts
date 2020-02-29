export default class HttpError extends Error {
  constructor(message : string, errorCode : number) {
    super(message); // Add a "message" property
    const code = errorCode;
  }
}