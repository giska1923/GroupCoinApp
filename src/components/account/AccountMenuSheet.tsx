import React from 'react';
import { Sheet, Button } from '../ui';
import { Column } from '../layout/Row';

interface AccountMenuSheetProps {
  visible: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  loading?: boolean;
}

export const AccountMenuSheet: React.FC<AccountMenuSheetProps> = ({
  visible,
  onClose,
  onEdit,
  onDelete,
  loading = false,
}) => (
  <Sheet visible={visible} onClose={onClose} title='Account'>
    <Column gap='md'>
      <Button
        variant='primary'
        size='lg'
        fullWidth
        disabled={loading}
        onPress={onEdit}
      >
        Edit
      </Button>

      <Button
        variant='destructive'
        size='lg'
        fullWidth
        loading={loading}
        onPress={onDelete}
      >
        Delete
      </Button>

      <Button variant='ghost' size='lg' fullWidth onPress={onClose}>
        Cancel
      </Button>
    </Column>
  </Sheet>
);
