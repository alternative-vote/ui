# Data state
```javascript

//Election
{
  id : '',
  name : '',
  candidates : [ref(candidate)],
  categories : [ref(category)]
}

//candidate
{
  id : '',
  name : '',
  description : '',
  members : [ref(user)]
}

//user
{
  id : '',
  name : ''
}

//category
{
  id : '',
  name : '',
  ballots : [ref(ballot)]
}

//ballot
{
  id : '',
  finalized : true,
  user : ref(user)
  votes : [ref(candidate)]
}
```

# UI state

Pages:
 - login
 - into
 - ballot (per category)
 - finalize
 - survey (?)

- Logged in
- Page viewed (login, ballot per category)
