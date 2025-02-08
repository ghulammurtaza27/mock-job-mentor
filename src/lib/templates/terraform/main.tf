provider "aws" {
  region = var.aws_region
}

module "vpc" {
  source = "./modules/vpc"
  
  project_name    = var.project_name
  environment     = var.environment
  vpc_cidr        = var.vpc_cidr
  azs             = var.availability_zones
  private_subnets = var.private_subnet_cidrs
  public_subnets  = var.public_subnet_cidrs
}

module "eks" {
  source = "./modules/eks"
  
  cluster_name    = "${var.project_name}-${var.environment}"
  vpc_id          = module.vpc.vpc_id
  subnet_ids      = module.vpc.private_subnet_ids
  node_group_name = "${var.project_name}-${var.environment}-nodes"
  
  desired_size = 2
  max_size     = 4
  min_size     = 1
  
  instance_types = ["t3.medium"]
}

module "rds" {
  source = "./modules/rds"
  
  identifier     = "${var.project_name}-${var.environment}"
  engine         = "postgres"
  engine_version = "13.7"
  
  vpc_id          = module.vpc.vpc_id
  subnet_ids      = module.vpc.private_subnet_ids
  
  instance_class  = "db.t3.micro"
  database_name   = var.database_name
  master_username = var.database_username
  
  backup_retention_period = 7
  multi_az               = false
}

module "lambda" {
  source = "./modules/lambda"
  
  function_name = "${var.project_name}-${var.environment}"
  handler       = "index.handler"
  runtime       = "nodejs16.x"
  
  vpc_id          = module.vpc.vpc_id
  subnet_ids      = module.vpc.private_subnet_ids
  
  environment_variables = {
    NODE_ENV = var.environment
    DB_HOST  = module.rds.endpoint
  }
} 