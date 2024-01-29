#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { EcsStack } from '../lib/ecs-stack';
import { VpcStack } from '../lib/network-stack';
import { ECRStack } from '../lib/ecr-stack';

const app = new cdk.App();
const envShortCode = app.node.tryGetContext('envShortCode');
const serviceName = 'myservice';


// VPC Stack
const vpcStack = new VpcStack(app, `${envShortCode}-${serviceName}-VpcStack`,  {
  environment: `${envShortCode}`,
  serviceName: `${serviceName}`,
  vpcCIDR: '10.195.0.0/16',
  vpcAZs: 2,
  vpcNGW: 1,
  regionName: `${process.env.CDK_DEFAULT_REGION}`
});

// ECR Stack
const ecrStack = new ECRStack(app, `${envShortCode}-${serviceName}-ecrStack`,{
  environment: `${envShortCode}`,
  serviceName: `${serviceName}`,
  regionName: `${process.env.CDK_DEFAULT_REGION}`,
  deleteRemovalPolicy: true,
  imageRetainDays: 10
});

// ECS Stack
const fargatCluster = new EcsStack(app, `${envShortCode}-${serviceName}-ecsStack`,{
  regionName: `${process.env.CDK_DEFAULT_REGION}`,
  environment: `${envShortCode}`,
  serviceName: `${serviceName}`,
  vpc: vpcStack.vpc,
  ServiceImage: '<aws_account_number>.dkr.ecr.<region>.amazonaws.com/<reponame>/flask:latest',
  FluntBitImage: '<aws_account_number>.dkr.ecr.<region>.amazonaws.com/<reponame>/fluentbit:v1'
});



cdk.Tags.of(app).add('Environment', `${envShortCode}`);
cdk.Tags.of(app).add('Owner', 'Arun');
