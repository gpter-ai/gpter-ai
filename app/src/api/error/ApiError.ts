export default abstract class ApiError extends Error {
  constructor(public message: string) {
    super();
  }
}
