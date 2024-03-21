import React, { useState, useRef, useMemo } from "react";
import JoditEditor, { Jodit } from "jodit-react";
import type { BuildDataResult, IDictionary, IUploader, IUploaderAnswer, IUploaderData, HandlerSuccess, CanPromise, IAjax, IUploaderOptions } from 'jodit/types';

export interface EditorProps {
  width?: string | number;
  height?: string | number;
  readonly?: boolean;
  disabled?: boolean;
  placeholder?: string;
  disablePlugins?: string | string[];
}

/*
interface EditorConfig {
  height: string | number;
  width: string | number;
  placeholder: string;
  spellcheck: boolean;
  language: string;
  countHTMLChars: boolean;
  buttons: string[];
  buttonsXS: string[];
  buttonsMD: string[];
  buttonsSM: string[];
  showWordsCounter: boolean;
  showCharsCounter: boolean;
  showXPathInStatusbar: boolean;
  askBeforePasteFromWord: boolean;
  readonly: boolean;
  disabled: boolean;
  enableDragAndDropFileToEditor: boolean;
  askBeforePasteHTML: boolean;
  defaultActionOnPaste: string;
  defaultActionOnPasteFromWord: string;
  disablePlugins: string | string[];
  iframe: boolean;
  iframeStyle: string;
  allowResizeX: boolean;
  allowResizeY: boolean;
  theme: string;
  removeButtons: string[];
  toolbarAdaptive: boolean;
  style: {
    font: string;
    overflow: string;
  };
  events: {
    afterRemoveNode: (node: HTMLElement) => void;
    validarSeTemErro: () => void;
  };
  uploader: {
    buildData: (opt: IUploaderOptions<string>, data: FormData) => BuildDataResult;
    url: string | IDictionary<string> | FormData;
    headers?: IDictionary<string> | null | ((this: IAjax<any>) => CanPromise<IDictionary<string> | null>);
    isSuccess: (opt: IUploaderOptions<string>, resp: IUploaderAnswer) => boolean;
    process: (opt: IUploaderOptions<string>, resp: IUploaderAnswer) => IUploaderData;
    defaultHandlerSuccess: HandlerSuccess;
  };
}
*/

const Editor = React.forwardRef<Jodit, EditorProps>((props, ref) => {
  const { width, height, readonly, disabled, placeholder, disablePlugins } = props;
  const editor = useRef(null);
  const [value, setValue] = useState('');
  const BOTOES_PADROES = ['source', '|', "bold", "italic", "underline", "strikethrough", "|", "ul", "ol", "|", "center", "left", "right", "justify", "|", "image"];

  const config = useMemo(
    () => ({
      height: height || 'auto',
      width: width || 'auto',
      placeholder: placeholder || '',
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
      readonly: readonly || false,
      disabled: disabled || false,
      enableDragAndDropFileToEditor: true,
      defaultActionOnPasteFromWord: 'insert_clear_html',
      disablePlugins: disablePlugins ? ['image-properties'].concat(disablePlugins) : ['image-properties'],
      theme: "default",
      allowResizeX: false,
      allowResizeY: false,
      style: {
        font: '16px Arial',
        overflow: 'none',
      },
      events: {
        afterRemoveNode: (node: HTMLElement) => {},
        validarSeTemErro: () => {}
      },
      uploader: {
        buildData: (data: FormData) => ({}),
        url: '',
        headers: {
          Authorization: '',
        },
        isSuccess: (resp: IUploaderAnswer) => ({}),
        process: (resp: IUploaderAnswer) => ({}),
        defaultHandlerSuccess: () => ({})
      }
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
