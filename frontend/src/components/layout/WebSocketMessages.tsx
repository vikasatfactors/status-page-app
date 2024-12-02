import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { clearMessages } from '@/store/wsSlice';

const WebSocketMessages: React.FC = () => {
  const dispatch = useDispatch();
  const messages = useSelector((state: any) => state.webSocket.messages);

  // Track if the user has opened the notification panel
  const [isPopoverOpen, setPopoverOpen] = useState(false);

  const sortedMessages = useMemo(
    () =>
      [...messages].sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ),
    [messages]
  );

  const hasNewMessages = messages.length > 0;

  const handleClearMessages = () => {
    dispatch(clearMessages());
    setPopoverOpen(false);
  };

  return (
    <Popover
      onOpenChange={(open) => {
        setPopoverOpen(open);
        if (open) {
          // Optionally mark notifications as "read" here
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button variant='ghost' className='relative'>
          <Bell className='w-6 h-6 text-gray-600' />
          {hasNewMessages && (
            <span className='absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-pulse' />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side='bottom'
        align='end'
        className='w-80 max-h-96 overflow-auto p-4 bg-white rounded-lg shadow-md'
      >
        <div className='flex justify-between items-center'>
          <h3 className='text-lg font-bold'>Notifications</h3>
          {hasNewMessages && (
            <Button
              variant='outline'
              size='sm'
              onClick={handleClearMessages}
              className='text-xs'
            >
              Clear
            </Button>
          )}
        </div>
        <div className='mt-6'>
          <h2 className='text-2xl font-semibold'>WebSocket Messages</h2>
          {sortedMessages.length === 0 ? (
            <p className='text-gray-500'>No notifications</p>
          ) : (
            <ul className='space-y-2'>
              {sortedMessages.map((msg, index) => (
                <li
                  key={index}
                  className='p-2 border rounded-lg shadow-sm bg-gray-50'
                >
                  <p className='text-sm'>{msg.message}</p>
                  <span className='text-xs text-gray-400'>
                    {new Date(msg.timestamp).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default WebSocketMessages;
