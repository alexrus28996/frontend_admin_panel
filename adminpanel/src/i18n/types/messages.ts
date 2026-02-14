import en from "@/messages/en.json";

type DotPrefix<TPrefix extends string, TKey extends string> = TPrefix extends ""
  ? TKey
  : `${TPrefix}.${TKey}`;

type FlattenMessageKeys<TValue, TPrefix extends string = ""> = TValue extends string
  ? TPrefix
  : {
      [TKey in keyof TValue & string]: FlattenMessageKeys<TValue[TKey], DotPrefix<TPrefix, TKey>>;
    }[keyof TValue & string];

export type Messages = typeof en;
export type MessageKey = FlattenMessageKeys<Messages>;
