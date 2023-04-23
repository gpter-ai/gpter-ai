// https://docs.gitguardian.com/secrets-detection/detectors/specifics/openai_apikey
// @TODO - consider if this check is useful, in case they change their pattern
export const OPENAI_API_KEY_PATTERN = /sk-[a-z0-9]{40,50}/;
