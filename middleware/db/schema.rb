# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_02_27_185635) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "metrics_epics", force: :cascade do |t|
    t.integer "wip_bigrocks"
    t.integer "wip_other"
    t.integer "todo_bigrocks"
    t.integer "todo_other"
    t.string "report_period"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "metrics_sprints", force: :cascade do |t|
    t.string "name"
    t.text "goal"
    t.float "scope_change_pct"
    t.float "forecast_error_pct"
    t.float "story_pct"
    t.float "spike_pct"
    t.float "bug_pct"
    t.float "data_fix_pct"
    t.float "operational_work_pct"
    t.float "incident_pct"
    t.float "technical_debt_pct"
    t.bigint "team_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "jid"
    t.index ["team_id"], name: "index_metrics_sprints_on_team_id"
  end

  create_table "metrics_story_brs", force: :cascade do |t|
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "bigrocks"
    t.integer "other"
    t.string "report_period"
  end

  create_table "metrics_t3s", force: :cascade do |t|
    t.date "startDate"
    t.date "endDate"
    t.integer "customDev"
    t.integer "quote"
    t.integer "split"
    t.integer "merge"
    t.integer "postConversion"
    t.integer "sre"
    t.integer "datafix"
    t.integer "csl1"
    t.integer "documentation"
    t.integer "ccMerge"
    t.integer "other"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "investigation"
  end

  create_table "teams", force: :cascade do |t|
    t.integer "jid"
    t.integer "bid"
    t.string "name"
    t.integer "last_sprint"
    t.integer "current_sprint"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  add_foreign_key "metrics_sprints", "teams"
end
