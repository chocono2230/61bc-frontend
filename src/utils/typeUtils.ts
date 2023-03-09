// 引数xはK[]のプロパティを持っているオブジェクトであることを示す関数
// 持っていることを示せるが、それはunknown型
// 型ガード関数の中で用いると便利
// 例：
// const isDispContent = (content: unknown): content is DispContentType => {
//   if (
//     hasProperty(content, 'contentId', 'title', 'dialogFlag', 'dispContentItems')
//   ) {
//     if (
//       typeof content.contentId === 'string' &&
//       typeof content.title === 'string' &&
//       typeof content.dialogFlag === 'boolean'
//     ) {
//       if (content.dispContentItems instanceof Array) {
//         return (
//           content.dispContentItems.length === 0 ||
//           content.dispContentItems.every(e => typeof e === 'string')
//         );
//       }
//     }
//   }
//   return false;
// };
export function hasProperty<K extends string>(x: unknown, ...name: K[]): x is { [M in K]: unknown } {
  return x instanceof Object && name.every((prop) => prop in x);
}

// 非同期関数のReturnType時にPromiseの中身を抽出する。
// 例:
// type ContentItemsType = PromiseType<
//   ReturnType<typeof ContentItemService.listContentItemsByContentId>
// >;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PromiseType<T extends Promise<any>> = T extends Promise<infer P> ? P : never;
