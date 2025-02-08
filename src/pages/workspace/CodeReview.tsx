import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react'

interface Review {
  id: string
  title: string
  description: string
  code: string
  status: 'pending' | 'approved' | 'rejected'
  comments: Comment[]
}

interface Comment {
  id: string
  text: string
  author: string
  createdAt: Date
}

const CodeReview = () => {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      title: 'Add user authentication',
      description: 'Implemented login and signup functionality',
      code: 'const login = async (email, password) => {\n  // Implementation\n}',
      status: 'pending',
      comments: []
    }
  ])
  const [newComment, setNewComment] = useState('')

  const handleAddComment = (reviewId: string) => {
    if (!newComment.trim()) return

    setReviews(reviews.map(review => {
      if (review.id === reviewId) {
        return {
          ...review,
          comments: [...review.comments, {
            id: Date.now().toString(),
            text: newComment,
            author: 'Current User',
            createdAt: new Date()
          }]
        }
      }
      return review
    }))
    setNewComment('')
  }

  const handleUpdateStatus = (reviewId: string, status: Review['status']) => {
    setReviews(reviews.map(review => 
      review.id === reviewId ? { ...review, status } : review
    ))
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Code Reviews</h1>

      {reviews.map(review => (
        <Card key={review.id} className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold">{review.title}</h2>
              <p className="text-gray-600">{review.description}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={review.status === 'approved' ? 'default' : 'outline'}
                onClick={() => handleUpdateStatus(review.id, 'approved')}
              >
                <ThumbsUp className="w-4 h-4 mr-2" />
                Approve
              </Button>
              <Button
                variant={review.status === 'rejected' ? 'destructive' : 'outline'}
                onClick={() => handleUpdateStatus(review.id, 'rejected')}
              >
                <ThumbsDown className="w-4 h-4 mr-2" />
                Reject
              </Button>
            </div>
          </div>

          <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
            <code>{review.code}</code>
          </pre>

          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Comments
            </h3>
            
            {review.comments.map(comment => (
              <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{comment.author}</span>
                  <span>{comment.createdAt.toLocaleDateString()}</span>
                </div>
                <p className="mt-2">{comment.text}</p>
              </div>
            ))}

            <div className="flex gap-2">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1"
              />
              <Button onClick={() => handleAddComment(review.id)}>
                Comment
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

export default CodeReview 