IMAGE=sensy-mdv2-admin-frontend
PROJECT=sensy-md-ui-dev
TAG=latest
BRANCH=develop

# CI target for Cloud Build or local testing
ci:
	docker build --target test -t ${IMAGE}:test .
	docker run -t --rm ${IMAGE}:test npm run lint
	docker run -t --rm ${IMAGE}:test npm run build

# Deploy target (builds production image and pushes to registry)
deploy:
	docker build --target release -t ${IMAGE}:release .
	docker tag ${IMAGE}:release asia-northeast1-docker.pkg.dev/${PROJECT}/sensy-mdv2/${IMAGE}:${BRANCH}
	docker push asia-northeast1-docker.pkg.dev/${PROJECT}/sensy-mdv2/${IMAGE}:${BRANCH}

# Helper to run everything locally
local-ci:
	npm run lint
	npm run build
