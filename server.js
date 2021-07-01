const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

const schema = buildSchema(`
  type Course {
    id: ID
    courseName: String
    category: String
    price: Int
    language: String
    email: String
    stack: Stack
    teachingAssists: [TeachingAssist]
  }

  type TeachingAssist {
      firstName: String
      lastName: String
      experience: Int
  }

  enum Stack {
      WEB
      MOBILE
      OTHER
  }

  type Query {
      getCourse(id: ID): Course
  }

  input CourseInput {
    id: ID
    courseName: String!
    category: String
    price: Int
    language: String
    email: String
    stack: Stack
    teachingAssists: [TeachingAssistInput]
  }

  input TeachingAssistInput{
    firstName: String
    lastName: String
    experience: Int
  }

  type Mutation {
      createCourse(input: CourseInput): Course
  }

`);
// ! means compulsory field

class Course {
    constructor(id, {
        courseName, category, price, language, email, stack, teachingAssists
    }) {
        this.id = id
        this.courseName = courseName
        this.category = category
        this.price = price
        this.language = language
        this.email = email
        this.stack = stack
        this.teachingAssists = teachingAssists
    }
}

const courseholder = {}

const resolvers = {
    getCourse: ({ id }) => {
        return new Course(id, courseholder[id])
    },
    createCourse: ({input}) => {
        let id = 1;
        courseholder[id] = input;
        return new Course(id, input);
    }
}

const root = resolvers;

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.listen(5000, () => console.log('Server running'));