export enum TextEditorFormatting {
  BOLD = 'bold',
  ITALIC = 'italic',
  HEADING_2 = 'heading_2',
  HEADING_3 = 'heading_3',
  BULLET_LIST = 'bulletList',
  ORDERED_LIST = 'orderedList',
  BLOCKQUOTE = 'blockquote',
  LINK = 'link'
}

export type TextEditorFormatConfig = Set<TextEditorFormatting>
