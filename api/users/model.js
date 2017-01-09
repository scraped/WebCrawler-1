/**
 * Created by Mel on 04/08/2016.
 */

module.exports = function(db, Sequelize)
{
    var User = db.define('user',
    {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV1,
            primaryKey: true
        },
        firstname: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: 3,
                    msg: "First Name must be atleast 3 characters in length"
                }
            }
        },
        lastname: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: 3,
                    msg: "Last Name must be atleast 3 characters in length"
                }
            }
        },
        biography: {
            type: Sequelize.STRING,
            allowNull: true
        },
        birthdate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        phone: {
            type: Sequelize.STRING,
            allowNull: true
        },
        city: {
            type: Sequelize.STRING,
            allowNull: true
        },
        country: {
            type: Sequelize.STRING,
            allowNull: true
        },
        postal_code: {
            type: Sequelize.STRING,
            allowNull: true
        },
        road_number: {
            type: Sequelize.STRING,
            allowNull: true
        },
        road_name: {
            type: Sequelize.STRING,
            allowNull: true
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            validate: {
                len: {
                    args: [6, 128],
                    msg: "Email address must be between 6 and 128 characters in length"
                },
                isEmail: {
                    msg: "Email address must be valid"
                }
            }
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: 3
                }
            }
        },
        activated: {
            type: Sequelize.BOOLEAN,
            defaultValue: 0
        },
        ban: {
            type: Sequelize.BOOLEAN,
            defaultValue: 0
        },
        ban_start: {
            type: Sequelize.DATE,
            allowNull: true
        },
        ban_end: {
            type: Sequelize.DATE,
            allowNull: true
        },
        role: {
            type: Sequelize.ENUM('user', 'admin')
        },
        resetKey:
        {
            type: Sequelize.STRING
        },
        activationKey:
        {
            type: Sequelize.STRING
        }
    },
    {
        classMethods:
        {
            associate: function(models)
            {

            }
        }
    });

    return User;
};
