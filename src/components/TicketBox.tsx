import { Ticket } from '../types';

interface Props {
  ticket: Ticket;
  onClick: (ticket: Ticket) => void;
}

export default function TicketBox({ ticket, onClick }: Props) {
  return (
    <div 
      className={`ticket-box ticket-${ticket.status}`}
      onClick={() => onClick(ticket)}
    >
      {ticket.number}
    </div>
  );
}
