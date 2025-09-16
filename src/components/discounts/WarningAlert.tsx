import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';

type Props = {
  isAlertDialogOpen: boolean;
  setIsAlertDialogOpen: (isOpen: boolean) => void;
  alertDialogProps: {
    title: string;
    description: string;
    action: () => void;
  };
};

const WarningAlert = (props: Props) => {
  const { isAlertDialogOpen, setIsAlertDialogOpen, alertDialogProps } = props;

  return (
    <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{alertDialogProps.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {alertDialogProps.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              alertDialogProps.action();
              setIsAlertDialogOpen(false);
            }}
            className="cursor-pointer"
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default WarningAlert;
