namespace :deploy do
  desc "Your basic deploy to prod script"
  task :production do
    push_to_heroku
    migrate_database
    #precompile_assets
  end

  def push_to_heroku
    puts "DEPLOY ======>    PUSHING TO HEROKU"
    sh "git push heroku master"
  end

  def migrate_database
    puts "DEPLOY ======>    MIGRATING DATABASE"
    sh "heroku run rake db:migrate"
  end

  def precompile_assets
    puts "DEPLOY ======>    PRECOMPILING ASSETS"
    sh "heroku run rake assets:precompile"
  end
end
