npm run build
rm -rf $GOPATH/src/github.com/alternative-vote/server/client/*
cp -R {index.html,static} $GOPATH/src/github.com/alternative-vote/server/client
cp -R favicons/* $GOPATH/src/github.com/alternative-vote/server/client