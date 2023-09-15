import ContentEditable from 'react-contenteditable';
import sanitizeHtml from 'sanitize-html';

const sanitizeConf = {
  allowedTags: ['b', 'i', 'em', 'strong', 'a', 'br', 'p'],
  allowedAttributes: { a: ['href'] },
};

export default function EditableHtml({
  html,
  onChange,
  ...otherProps
}: {
  html: string;
  onChange: (value: string) => void;
  className?: string;
  tagName?: string;
}) {
  return (
    <ContentEditable
      tagName="div"
      html={sanitizeHtml(html, sanitizeConf)}
      onChange={({ target }) => onChange(sanitizeHtml(target.value, sanitizeConf))}
      onKeyDown={(event) => event.stopPropagation()}
      onKeyUp={(event) => event.stopPropagation()}
      {...otherProps}
    />
  );
}
