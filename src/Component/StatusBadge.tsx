import { Chip } from '@mui/material';
import { CheckCircle, HourglassEmpty, Cancel } from '@mui/icons-material';

type StatusBadgeProps = {
  status: string;
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getChipProps = (): {
    label: string;
    color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
    icon?: React.ReactElement;
  } => {
    switch (status) {
      case 'Approved':
        return {
          label: 'อนุมัติแล้ว',
          color: 'success',
          icon: <CheckCircle fontSize="small" />,
        };
      case 'Pending':
        return {
          label: 'รอดำเนินการ',
          color: 'warning',
          icon: <HourglassEmpty fontSize="small" />,
        };
      case 'Rejected':
        return {
          label: 'ไม่อนุมัติ',
          color: 'error',
          icon: <Cancel fontSize="small" />,
        };
      default:
        return {
          label: status,
          color: 'default',
        };
    }
  };

  const chipProps = getChipProps();

  return <Chip variant="outlined" {...chipProps} />;
};

export default StatusBadge;