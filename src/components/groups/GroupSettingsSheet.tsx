import React from 'react';
import { Sheet, Button } from '../ui';
import { Column } from '../layout/Row';

interface GroupSettingsSheetProps {
  visible: boolean;
  onClose: () => void;
  canManage: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onLeave: () => void;
  loading?: boolean;
}

export const GroupSettingsSheet: React.FC<GroupSettingsSheetProps> = ({
  visible,
  onClose,
  canManage,
  onEdit,
  onDelete,
  onLeave,
  loading = false,
}) => (
  <Sheet visible={visible} onClose={onClose} title='Group settings'>
    <Column gap='md'>
      {canManage && (
        <>
          <Button
            variant='primary'
            size='lg'
            fullWidth
            disabled={loading}
            onPress={onEdit}
          >
            Edit group
          </Button>
          <Button
            variant='destructive'
            size='lg'
            fullWidth
            loading={loading}
            onPress={onDelete}
          >
            Delete group
          </Button>
        </>
      )}

      {!canManage && (
        <Button
          variant='destructive'
          size='lg'
          fullWidth
          loading={loading}
          onPress={onLeave}
        >
          Leave group
        </Button>
      )}

      <Button variant='ghost' size='lg' fullWidth onPress={onClose}>
        Cancel
      </Button>
    </Column>
  </Sheet>
);
