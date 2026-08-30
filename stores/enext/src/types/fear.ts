
/* Interface for data sets returned from fear API */
export interface FearEnvelope<T> {
  result: T[];
  success: boolean;
  message: string;
  count: number;
}
