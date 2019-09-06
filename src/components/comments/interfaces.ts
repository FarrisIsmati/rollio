export interface Comment {
    _id: string,
    name: string,
    commentDate: string,
    text: string
  }
  
export interface CommentSectionProps {
  comments: Comment[]
  }

export interface CommentPostProps  {
    time: string,
    name: string,
    text: string
  }