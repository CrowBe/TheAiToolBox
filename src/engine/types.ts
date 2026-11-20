/**
 * Schema-driven catalog engine.
 *
 * A box is site copy, an item shape, and which fields are filterable labels.
 * Nothing in this folder knows about AI tools. AIToolBox is the first box;
 * later catalogs (benchmarks, inference engines, hardware, quant) can reuse
 * the same filter, search, validation, and page components.
 */

export type VocabularyEntry = {
  id: string;
  label: string;
  description?: string;
  featured?: boolean;
  sort?: number;
};

export type LabelType = "string" | "number" | "string-list";

/** Picker hint. The catalog UI renders every label as a multi-select combobox. */
export type LabelControl = "checkboxes" | "combobox";

export type LabelField = {
  field: string;
  label: string;
  type: LabelType;
  control: LabelControl;
  vocabulary?: string;
  /** Query-string key. Defaults to `field`. */
  param?: string;
  showOnCard?: boolean;
  cardLimit?: number;
};

export type Collection = {
  field: string;
  /** Plural heading, e.g. "Categories". */
  label: string;
  /** Route prefix, e.g. "/categories". The app route must match this path. */
  path: string;
  vocabulary: string;
};

export type MarkConfig = {
  nameField: string;
  urlField: string;
  colorField?: string;
};

export type BoxConfig = {
  id: string;
  site: {
    name: string;
    shortName: string;
    tagline: string;
    description: string;
  };
  item: {
    noun: { one: string; other: string };
    idField: string;
    slugField: string;
    sortField: string;
    /** Route prefix for a single record, e.g. "/tools". */
    path: string;
  };
  search: {
    fields: string[];
    placeholder: string;
  };
  labels: LabelField[];
  card: {
    titleField: string;
    subtitleField: string;
    mark?: MarkConfig;
  };
  detail: {
    titleField: string;
    subtitleField: string;
    bodyField: string;
    linkField: string;
    linkLabel: string;
    meta: { field: string; label: string }[];
    mark?: MarkConfig;
  };
  collections: Collection[];
  /** Signed-in list of saved records. The app route must match `path`. */
  library: {
    path: string;
    label: string;
  };
  vocabularies: Record<string, VocabularyEntry[]>;
};

export type FilterState = {
  q: string;
  selected: Record<string, string[]>;
};

export type LockedFilter = {
  field: string;
  value: string;
};

export type FilterOption = {
  value: string;
  label: string;
  count: number;
};
