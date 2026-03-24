declare module '@hookform/resolvers/zod' {
  import type { ZodSchema } from 'zod';
  import type { FieldValues, Resolver } from 'react-hook-form';

  export function zodResolver<
    T extends ZodSchema,
    TFieldValues extends FieldValues = FieldValues,
  >(schema: T): Resolver<TFieldValues, unknown>;
}
