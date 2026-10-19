'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'

interface ApprovalModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  amount: number
  onApprove: (notes: string) => Promise<void>
  onReject: (reason: string) => Promise<void>
}

export function ApprovalModal({ 
  isOpen, 
  onClose, 
  title, 
  amount, 
  onApprove, 
  onReject 
}: ApprovalModalProps) {
  const [approvalNotes, setApprovalNotes] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')
  const [isRejecting, setIsRejecting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleApprove = async () => {
    setIsLoading(true)
    try {
      await onApprove(approvalNotes)
      setApprovalNotes('')
      onClose()
    } finally {
      setIsLoading(false)
    }
  }

  const handleReject = async () => {
    setIsLoading(true)
    try {
      await onReject(rejectionReason)
      setRejectionReason('')
      setIsRejecting(false)
      onClose()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isRejecting ? 'Reject Request' : 'Approve Request'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-muted/30 rounded-lg p-3 border border-border">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Request</p>
            <p className="text-base text-foreground font-semibold">{title}</p>
          </div>

          <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Amount</p>
            <p className="text-2xl font-bold" style={{ color: '#2563eb' }}>₹{amount.toLocaleString('en-IN')}</p>
          </div>

          {isRejecting ? (
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Rejection Reason <span className="text-destructive">*</span>
              </label>
              <Textarea
                placeholder="Explain why you're rejecting this request..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="min-h-24 border-border focus:border-destructive"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Approval Notes <span className="text-muted-foreground font-normal">(Optional)</span>
              </label>
              <Textarea
                placeholder="Add any notes or comments..."
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                className="min-h-20 border-border focus:border-primary"
              />
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 pt-2">
          {isRejecting ? (
            <>
              <Button
                variant="outline"
                onClick={() => setIsRejecting(false)}
                disabled={isLoading}
                className="border-border text-foreground hover:bg-muted"
              >
                ← Back
              </Button>
              <Button
                onClick={handleReject}
                disabled={isLoading || !rejectionReason.trim()}
                style={{ backgroundColor: '#dc2626', color: '#ffffff', fontWeight: 600 }}
                className="hover:opacity-90 transition-opacity"
              >
                {isLoading ? 'Rejecting...' : '✗ Confirm Rejection'}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="border-border text-foreground hover:bg-muted"
              >
                Cancel
              </Button>
              <Button
                onClick={() => setIsRejecting(true)}
                disabled={isLoading}
                style={{ backgroundColor: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', fontWeight: 600 }}
                className="hover:opacity-90 transition-opacity"
              >
                ✗ Reject
              </Button>
              <Button
                onClick={handleApprove}
                disabled={isLoading}
                style={{ backgroundColor: '#16a34a', color: '#ffffff', fontWeight: 700 }}
                className="hover:opacity-90 transition-opacity shadow-md"
              >
                {isLoading ? 'Approving...' : '✓ Approve'}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
