import { Button } from "../Common/Button";

export const GlobalModeButton: React.FC<{
  text: string;
}> = ({ text }) => {
  return (
    <Button size="sm" variant="global" className="!text-xs !px-2 !py-1 !min-w-0 max-w-[80px]">
      {text}
    </Button>
  );
};
