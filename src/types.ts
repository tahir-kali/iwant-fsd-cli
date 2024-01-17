export type TArgs = string | string[] | undefined | null;
export type TGeneratePage = (name: string) => Promise<void>;
export type TGenerateEntity = (name: string, args: TArgs) => Promise<void>;
export type TGenerateFeatureOrWidget = (
  name: string,
  what: string,
) => Promise<void>;
export type TGenerators = {
  page: Promise<void>;
  entity: Promise<void>;
  feature: Promise<void>;
  widget: Promise<void>;
  shared: Promise<void>;
};
