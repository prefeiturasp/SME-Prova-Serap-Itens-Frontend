import { Editor as ClassicEditor } from 'ckeditor5-custom-build/build/ckeditor';

import { CKEditor } from '@ckeditor/ckeditor5-react';

type TextEditorProps = {
  value?: any;
  onChange?: any;
};

export const TextEditor: React.FC<TextEditorProps> = ({ value, onChange }) => {
  const isEmpty = (data: any) => {
    const div = document.createElement('div');
    div.innerHTML = data;

    const hasImage = data?.includes('<img');
    if (hasImage) return false;

    return !div?.textContent?.trim();
  };

  const handleEditorChange = (_: any, editor: any) => {
    const data = editor?.getData();

    const empty = isEmpty(data);
    if (empty) {
      onChange('');
    } else {
      onChange(data);
    }
  };

  return (
    <CKEditor
      editor={ClassicEditor}
      data={value}
      onChange={handleEditorChange}
      config={{
        removePlugins: ['Title'],
      }}
      onReady={(editor) => {
        editor.editing.view.change((writer: any) => {
          if (editor?.ui?.view?.stickyPanel) {
            editor.ui.view.stickyPanel.unbind('isActive');
            editor.ui.view.stickyPanel.isActive = false;
          }
          writer?.setStyle('min-height', '180px', editor?.editing?.view?.document?.getRoot());
          writer?.setStyle('max-height', '500px', editor?.editing?.view?.document?.getRoot());
        });
      }}
    />
  );
};
