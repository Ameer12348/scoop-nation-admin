import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog'
import { Button } from '../ui/button'

const ConfirmDialog = ({ open, setOpen, loading ,children,onConfirm,title}) => {
    return (
        <Dialog open={open} onOpenChange={() => { setOpen(false) }}>
            <DialogContent className='p-0 min-w-[98vw] sm:min-w-[90vw] md:min-w-[700px] lg:min-w-[900px] gap-1  max-h-[90vh] flex flex-col'>
                <DialogHeader className='px-5 pt-5'>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                
                <div className="flex-1 px-5 overflow-y-auto">
                    {children}
                </div>
                
                <DialogFooter className='px-5 pb-2 pt-3 '>
                    <Button 
                        variant="outline" 
                        onClick={() => setOpen(false)}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={onConfirm}
                        disabled={loading}
                        
                    >
                        {loading ? 'Saving...' : 'Save'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )

}

export default ConfirmDialog