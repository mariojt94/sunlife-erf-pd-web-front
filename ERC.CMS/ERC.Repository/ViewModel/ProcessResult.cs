using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
    public class ProcessResult
    {
        public System.Collections.Generic.Dictionary<string, object> CustomField
        {
            get;
            set;
        }

        public bool isSucceed
        {
            get;
            set;
        }

        public string message
        {
            get;
            set;
        }

        public string returnValue
        {
            get;
            set;
        }

        public int ErrorCode
        {
            get;
            set;
        }

        public ProcessResult()
        {
            this.isSucceed = false;
            this.message = "";
            this.ErrorCode = 0;
            this.returnValue = "";

            this.CustomField = new System.Collections.Generic.Dictionary<string, object>();
        }

        public ProcessResultT<R> ToProcessResult<R>()
        {
            return new ProcessResultT<R>(this.isSucceed, this.message);
        }

        public ProcessResultT<R> ToProcessResult<R>(R returnValue)
        {
            return new ProcessResultT<R>(this.isSucceed, this.message, returnValue);
        }
    }
}
