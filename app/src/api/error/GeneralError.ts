import ApiError from './ApiError';

export default class GeneralError extends ApiError {
  constructor(message?: string) {
    const reason =
      message ??
      'Something went wrong when calling the assistant! Contact app developers for support if this error persists.';

    super(reason);
  }
}
