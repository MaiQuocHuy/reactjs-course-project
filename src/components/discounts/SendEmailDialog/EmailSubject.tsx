import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

type Props = {
  emailSubject: string;
  setEmailSubject: (subject: string) => void;
};

const EmailSubject = (props: Props) => {
  const { emailSubject, setEmailSubject } = props;
  return (
    <div className="space-y-2">
      <Label htmlFor="email-subject">Email Subject</Label>
      <Textarea
        id="email-subject"
        placeholder="Enter email subject (5-200 characters)"
        value={emailSubject}
        onChange={(e) => setEmailSubject(e.target.value)}
        className={
          emailSubject.length > 0 &&
          (emailSubject.length < 5 || emailSubject.length > 200)
            ? 'border-red-500'
            : ''
        }
        rows={3}
      />
      <div className="text-sm text-muted-foreground">
        {emailSubject.length}/200 characters
        {emailSubject.length > 0 && emailSubject.length < 5 && (
          <span className="text-red-500 ml-2">
            Minimum 5 characters required
          </span>
        )}
        {emailSubject.length > 200 && (
          <span className="text-red-500 ml-2">
            Maximum 200 characters exceeded
          </span>
        )}
      </div>
    </div>
  );
};

export default EmailSubject;
