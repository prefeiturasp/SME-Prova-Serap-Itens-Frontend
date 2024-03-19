import React, { useState, useRef, useMemo } from "react";
import JoditEditor, { Jodit } from "jodit-react";

export interface EditorProps {
  height?: string;
  readonly?: boolean
}

const Editor = React.forwardRef<Jodit, EditorProps>((props, ref) => {
  const { height, readonly } = props;
  const editor = useRef(null);
  const [value, setValue] = useState('');
  const BOTOES_PADROES = ['source', '|', "bold", "italic", "underline", "strikethrough", "|", "ul", "ol", "|", "center", "left", "right", "justify", "|", "image"];

  const config = useMemo(
    () => ({
      height: height,
      placeholder: '',
      spellcheck: true,
      language: 'pt_br',
      countHTMLChars: false,
      buttons: BOTOES_PADROES,
      showWordsCounter: false,
      showCharsCounter: false,
      buttonsXS: BOTOES_PADROES,
      buttonsMD: BOTOES_PADROES,
      buttonsSM: BOTOES_PADROES,
      showXPathInStatusbar: false,
      askBeforePasteFromWord: false,
      readonly: readonly,
      enableDragAndDropFileToEditor: true,
      defaultActionOnPasteFromWord: 'insert_clear_html',
      disablePlugins: ['image-properties'],
      uploader: { insertImageAsBase64URI: true },
      removeButtons: ["brush", "file"],
      toolbarAdaptive: false,
      theme: "default",
      allowResizeX: false,
      allowResizeY: false
    }),
    []
  );

  return (
    <JoditEditor
      ref={ editor }
      value={ value }
      onBlur={ value => setValue(value) }
      onChange={ value => {} }
      config={ config }>
    </JoditEditor>
  )
});

export default React.memo(Editor)
