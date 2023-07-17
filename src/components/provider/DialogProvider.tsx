import React, { memo, ReactNode } from 'react';
import { BottomSheetProvider } from 'tonviewer-web/components/bottom-sheet/Bottom-sheet';
import { LayoutProvider } from 'tonviewer-web/hooks/useLayout';
import { PopperProvider } from 'tonviewer-web/hooks/usePopper';
import { TooltipProvider } from 'tonviewer-web/hooks/useTooltip';

export const DialogProvider = memo((props: { children: ReactNode }) => {
  return (
    <BottomSheetProvider>
      <LayoutProvider>
        <PopperProvider>
          <TooltipProvider>{props.children}</TooltipProvider>
        </PopperProvider>
      </LayoutProvider>
    </BottomSheetProvider>
  );
});
