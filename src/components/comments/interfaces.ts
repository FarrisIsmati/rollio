export interface Comment {
    _id: string,
    name: string,
    commentDate: string,
    text: string
  }
  
  export interface CommentSectionProps {
    getComments: () => Comment[]
  }