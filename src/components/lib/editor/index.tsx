import { Editor as ClassicEditor } from 'ckeditor5-custom-build/build/ckeditor';

import { CKEditor } from '@ckeditor/ckeditor5-react';

type TextEditorProps = {
  value?: any;
  onChange?: any;
  placeholder?: string;
};

export const TextEditor: React.FC<TextEditorProps> = ({ value, onChange, placeholder }) => {

  const placeholderDefault = placeholder || '';
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
        removePlugins: ['Title', 'Link', 'LinkImage'],
        placeholder: placeholderDefault        
      }}
      onReady={(editor) => {
        editor.editing.view.change((writer: any) => {
          if (editor?.ui?.view?.stickyPanel) {
            editor.ui.view.stickyPanel.unbind('isActive');
            editor.ui.view.stickyPanel.isActive = false;
          }
          writer?.setStyle('min-height', '100px', editor?.editing?.view?.document?.getRoot());
          writer?.setStyle('max-height', '100px', editor?.editing?.view?.document?.getRoot());
          writer?.setStyle('color', '#595959', editor?.editing?.view?.document?.getRoot());
        });
        
        // Remove o link "Powered by CKEditor" e ajusta a borda
        setTimeout(() => {
          const poweredByElement = editor.ui.view.element?.querySelector('.ck-powered-by');
          if (poweredByElement) {
            poweredByElement.style.display = 'none';
          }
          
          // Muda a cor da borda do editor
          const editorElement = editor.ui.view.element?.querySelector('.ck-editor__editable');
          if (editorElement) {
            editorElement.style.borderColor = '#D5D5D5';
            editorElement.style.borderRadius = '4px';
          }
        }, 100);
      }}
    />
  );
};
